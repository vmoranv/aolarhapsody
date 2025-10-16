# How to Capture Packets

1. My Launcher
2. Extensions -> Developer Tools (F3)
3. Start Interception -> Select packets to add to the sending interface
4. Set times -> Send packets

# Launcher Syntax

## 1. Send Packet Command

```json
|#send={"param":{ },"cmd":" ","id":%num%}|
```

Where:

- `{ }` after `param` is the packet body
- `cmd` is followed by the activity cmd panel
- The number `%num%` after `id` specifies the activity type

For example: Qiling Shenshu Moon Dungeon refresh:

```json
|#send={"param":{"index":0},"cmd":"MB250221_refresh","id":42}|
```

Click on activity (id=42), `refresh` command in `MBMB250221` activity, `index=0` is the index on the left side of Qiling Shenshu Moon Dungeon; the packet body can be derived by decompiling swf with code/doc suffix -> sprites -> client suffix.

### 1.1 Battle Packets

```
|#send={"id":13,"param":{"turn":0,"tarPSId":0,"ussi":-1,"isAuto":false,"skillId":350040,"tarSId":11,"reqPSId":0},"cmd":"1401"}|
```

Parameter description:

- `reqPSId`: Our YaBi position
- `skillId`: Skill list
- `tarSId`: Opponent YaBi position
- `isAuto`: Whether this is an auto-battle packet
- `turn`: Round number
- `tarPSId`: Unknown
- `ussi`: Unknown

### 1.2 Mini-game Packets

## 2. Time Wait Command

```
|#time=%num%|
```

Wait for `%num%` ms before executing the next line.

For example:

```
|#time=500|
```

Wait for 500ms before executing the next line.

## 3. Auto Battle Control Command

```
|#auto=true|
```

Enable auto battle

```
|#auto=false|
```

Disable auto battle

## 4. Wait for Battle End Command

```
|#wait|
```

Wait for auto battle to end, but this command is invalid due to the existence of `|#send={"param":{},"cmd":"1212","id":13}|` confirm battle end packet.

## 5. Activity Path Packet

```
|#activ='url','cls'|
```

Activity path packet, refer to:

- [vmoranv/aola_mya_extract](https://github.com/vmoranv/aola_mya_extract): Aola Star extract activity path and encapsulate as mya py script
- [vmoranv/aola_code_panel_extract](https://github.com/vmoranv/aola_code_panel_extract): Extract activity path and encapsulate as mya packet based on url suffix=code/doc and cls=suffix=MainPl/MainPanel

## 6. Practical Case Analysis

[Qiling Shenshu Moon Case](<https://github.com/vmoranv/aolamya/blob/master/%E5%A5%87%E7%81%B5%E7%A5%9E%E6%A0%91/%E5%A5%87%E7%81%B5%E7%A5%9E%E6%A0%91%E6%9C%88%E5%89%AF%E6%9C%AC(%E7%99%BE%E7%94%B0%E5%BC%B1%E6%99%BA%E7%A8%8B%E5%BA%8F%E7%8C%BFindex%E5%92%8Ctype%E6%95%B0%E5%AD%97%E9%83%BD%E4%B8%8D%E4%BC%9A%E5%A1%AB%E8%8D%89%2C%E8%87%B3%E5%B0%911500%E4%B8%AA%E5%8C%85%E5%85%B3%E6%88%98%E6%96%97%E5%8A%A8%E7%94%BB).mya>)

```json
|#auto=true|
|#send={"param":{"index":0},"cmd":"MB250221_refresh","id":42}|
|#send={"param":{"index":0,"handler":"MB250221","type":99},"cmd":"54_22","id":15}|
|#time=500|
|#send={"param":{"eventId":44788},"cmd":"74_1","id":42}|
|#time=5000|
|#send={"param":{},"cmd":"1212","id":13}|
|#time=500|
|#send={"param":{},"cmd":"MB250221_panel","id":42}|

|#time=500|

|#send={"param":{"index":1},"cmd":"MB250221_refresh","id":42}|
|#send={"param":{"index":1,"handler":"MB250221","type":99},"cmd":"54_22","id":15}|
|#time=500|
|#send={"param":{"eventId":44788},"cmd":"74_1","id":42}|
|#time=5000|
|#send={"param":{},"cmd":"1212","id":13}|
|#time=500|
|#send={"param":{},"cmd":"MB250221_panel","id":42}|

|#send={"cmd":"MB250221_htu","id":42,"param":{"index":0}}|
|#send={"cmd":"MB250221_htu","id":42,"param":{"index":1}}|
|#send={"cmd":"MB250221_htu","id":42,"param":{"index":2}}|
|#send={"cmd":"MB250221_htu","id":42,"param":{"index":3}}|
|#send={"cmd":"MB250221_htu","id":42,"param":{"index":4}}|
|#send={"cmd":"MB250221_htu","id":42,"param":{"index":5}}|

|#send={"param":{"index":0,"num":200},"cmd":"MB250221_eu","id":42}|
|#send={"param":{"index":1,"num":200},"cmd":"MB250221_eu","id":42}|
|#send={"param":{"index":2,"num":200},"cmd":"MB250221_eu","id":42}|

|#send={"param":{"type":99,"handler":"MB250221_ff"},"id":15,"cmd":"54_22"}|
|#time=5000|

|#send={"param":{"index":0,"type":0},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":1,"type":0},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":2,"type":0},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":3,"type":0},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":4,"type":0},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":5,"type":0},"id":42,"cmd":"MB250221_ag"}|

|#send={"param":{"index":0,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":1,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":2,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":3,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":4,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":5,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":6,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":7,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":8,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":9,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":10,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":11,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":12,"type":1},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":13,"type":1},"id":42,"cmd":"MB250221_ag"}|

|#send={"param":{"index":14,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":15,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":16,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":17,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":18,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":19,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":20,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":21,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":22,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":23,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":24,"type":2},"id":42,"cmd":"MB250221_ag"}|
|#send={"param":{"index":25,"type":2},"id":42,"cmd":"MB250221_ag"}|
```

Line description:

- line1: Use auto battle to adapt to YaBi of different eras
- line2: Refresh boss to prevent repeated fights when unable to win
- line3: Battle entrance for the light jade on the left
- line4: Each battle packet waits at least 500ms
- line5: Battle event starts (preload can be omitted)
- line6: Wait for 5s (approximately 20 rounds)
- line7: Confirm battle end
- line9: Obtain light aura
- line13-20: Battle entrance for the dark jade on the right, can be seen that only the index in the packet body is modified: 0->1
- line22-27: Saint Tree upgrade 6 expansion upgrade, also traversing index
- line29-31: Inject aura, num is the number of auras
- line33-34: Saint Tree suppression
- line36-69: Achievement reward collection (damn, index and type have no pattern in different interfaces, fuck)
