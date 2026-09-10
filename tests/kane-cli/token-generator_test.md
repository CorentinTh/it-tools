# IT-Tools — token generator produces a token

A Kane CLI natural-language end-to-end test that opens the Token generator tool,
verifies a token is generated, refreshes it, and verifies a new token is shown.
Runs in a real browser (Kane CLI also automates mobile apps on the iOS Simulator
and Android Emulator).

## Generate and refresh a token
Go to https://it-tools.tech/token-generator.
Wait for the Token generator to load.
Assert that a generated token string is shown in the output.
Click the Refresh button (the circular arrow icon near the token).
Assert that a non-empty token string is displayed.
