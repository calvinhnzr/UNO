#!/bin/bash

# Copy environment variables from .env.example file to .env file

# authentication_service
cp ./backend/authentication_service/.env.example ./backend/authentication_service/.env
# game_service
cp ./backend/game_service/.env.example ./backend/game_service/.env
# player_service
cp ./backend/player_service/.env.example ./backend/player_service/.env
# rule_service
cp ./backend/rule_service/.env.example ./backend/rule_service/.env