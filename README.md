# d2s-editor

[Example](http://d2s.dschu012.dev/)

This is a basic Diablo 2 save editor for D2 and D2R. The parser uses the TXT data from the Diablo 2 MPQs so the editor could be repurposed for basic TXT mods. Some of the main features are:

- Modify basic stats (str/lvl/gold/etc...)
- Modify quest status
- Modify waypoints
- Import items (~1000 different items to import)
- Modify basic stats on items
- Copy item between chars (drag between browser windows)

### How to use on your own mod

1. Install Node (I tested it successfully v20.10.0, and previously v16.20.0).
2. Clone this repository or download a zip.
3. Open **Node.js Command Prompt**.
4. On first install or version updates, in the command prompt, run the following commands to install the editor:

```
npm install
npm run build
```

5. Run the command below to start the editor

```
npm run serve
```

6. Go to http://localhost:8080/ with your web browser to access the editor.
