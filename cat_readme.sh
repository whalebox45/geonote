frontend=$(cat ./frontend/README.md)
backend=$(cat ./backend/README.md)
combined="$frontend$backend"
echo "$combined" > README.md
