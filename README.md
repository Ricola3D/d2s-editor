# d2s-editor

Notice: this project is fully opensource. Feel free to clone it, contribute, make your own version, suggest or submit improvements...

[Example](http://d2s.dschu012.dev/)

This is a basic Diablo 2 save editor for D2 and D2R. The parser uses the TXT data from the Diablo 2 MPQs so the editor could be repurposed for basic TXT mods. Some of the main features are:

- Modify basic stats (str/lvl/gold/etc...)
- Modify quest status
- Modify waypoints
- Import items (~1000 different items to import)
- Modify basic stats on items
- Copy item between chars (drag between browser windows)

### How to use on your own mod

1. Install Node (I only tested v20.10.0 and v16.20.0, so maybe installing one of those would be safer). Make sure to check the box "Add node to path".
2. Clone this repository or download a zip. Unzip it somewhere on your disc.
3. Open the unzipped folder, SHIFT + right-click in an empty space and choose "Open in Terminal".
4. __On first install **or version updates**__, in the command prompt, run the following commands to install the editor:

```
npm install --legacy-peer-deps
npm run generate
npm run build
```

5. Run the command below to start the editor

```
npm run serve
```

6. Go to http://localhost:8080/ with your web browser to access the editor. If item pictures are slow to load, it's probably you forgot to run command "npm run generate" to create static images.

### Documentation on ReMoDDeD mod

- [Open Skills](pages/oskills.md)
- [Aura When Equipped](pages/aura_when_equipped.md)

- [Useful Links](pages/useful_links.md)
- [Superior affixes](pages/superiors.md)