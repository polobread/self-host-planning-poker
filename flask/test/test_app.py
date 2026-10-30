"""Exercise HTTP and Socket.IO after dependency upgrades without touching local data."""
import os
import unittest
from unittest.mock import patch

from peewee import SqliteDatabase

# app.py opens its database at import time. Keep that initialization in memory.
with patch.dict(os.environ, {"FLASK_DEBUG": "1"}), patch(
    "peewee.SqliteDatabase", return_value=SqliteDatabase(":memory:")
):
    import app as application

from gamestate.game_manager import GameManager
from gamestate.models import StoredGame, database_proxy


class AppIntegrationTestCase(unittest.TestCase):
    def setUp(self):
        self.database = SqliteDatabase(":memory:")
        database_proxy.initialize(self.database)
        self.database.connect()
        self.database.create_tables([StoredGame])
        application.gm = GameManager()
        application.app.config["TESTING"] = True
        self.clients = []

    def tearDown(self):
        for client in self.clients:
            if client.is_connected():
                client.disconnect()
        self.database.close()

    def new_player(self, game, name):
        client = application.socketio.test_client(
            application.app, flask_test_client=application.app.test_client()
        )
        self.clients.append(client)
        info = client.emit("join", {
            "game": game, "name": name, "spectator": False
        }, callback=True)
        self.assertEqual(info["name"], "Upgrade regression")
        return client

    def latest_state(self, client):
        states = [event["args"][0] for event in client.get_received()
                  if event["name"] == "state"]
        self.assertTrue(states)
        return states[-1]

    def test_two_players_vote_reveal_reset_and_disconnect(self):
        response = application.app.test_client().post("/create", json={
            "name": "Upgrade regression", "deck": "FIBONACCI"
        })
        self.assertEqual(response.status_code, 200)
        game = response.get_data(as_text=True)
        first = self.new_player(game, "A")
        second = self.new_player(game, "B")
        first.emit("pick_card", {"card": 5}, callback=True)
        second.emit("pick_card", {"card": 3}, callback=True)
        first.emit("reveal_cards", callback=True)
        for client in self.clients:
            state = self.latest_state(client)
            self.assertEqual(sorted(player["hand"] for player in state.values()), [3, 5])
        self.assertTrue(application.gm.get(game).info()["revealed"])
        second.emit("end_turn", callback=True)
        for client in self.clients:
            state = self.latest_state(client)
            self.assertTrue(all(player.get("hand") is None for player in state.values()))
        self.assertFalse(application.gm.get(game).info()["revealed"])
        first.disconnect()
        second.disconnect()
        self.assertNotIn(game, application.gm.games)
