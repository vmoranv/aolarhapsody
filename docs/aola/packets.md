# 如何抓取封包

1. My登录器
2. 扩展->开发者工具(F3)
3. 开始拦截->选中封包添加至发包界面
4. 设置次数->发送封包

# 登录器语法

## 1. 发送封包命令

```json
|#send={"param":{ },"cmd":" ","id":%num%}|
```

其中：

- `param` 后的 `{ }` 内是包体
- `cmd` 后的是活动cmd panel
- `id` 后的数字 `%num%` 指明活动类型

例如：奇灵神树月副本刷新：

```json
|#send={"param":{"index":0},"cmd":"MB250221_refresh","id":42}|
```

点击活动(id=42)，`MBMB250221` 活动中的 `refresh` 刷新命令，`index=0` 为奇灵神树月副本左边的序号；可通过反编译 code/doc 后缀的 swf->sprites->client 缀得出包体。

### 1.1 战斗封包

```json
|#send={"id":13,"param":{"turn":0,"tarPSId":0,"ussi":-1,"isAuto":false,"skillId":350040,"tarSId":11,"reqPSId":0},"cmd":"1401"}|
```

参数说明：

- `reqPSId`: 我方亚比位置
- `skillId`: 技能列表
- `tarSId`: 对位亚比位置
- `isAuto`: 本次是否为自动战斗发包
- `turn`: 回合数
- `tarPSId`: 未知
- `ussi`: 未知

### 1.2 小游戏封包

## 2. 时间等待命令

```json
|#time=%num%|
```

等待 `%num%` ms 后执行下一行。

例如：

```json
|#time=500|
```

则等待 500ms 后执行下一行。

## 3. 自动战斗控制命令

```json
|#auto=true|
```

开启自动战斗

```json
|#auto=false|
```

关闭自动战斗

## 4. 等待战斗结束命令

```json
|#wait|
```

## 5. 活动路径封包

```json
|#activ='url','cls'|
```

活动路径封包，具体参考：

- [vmoranv/aola_mya_extract](https://github.com/vmoranv/aola_mya_extract)：奥拉星提取活动路径并封装为 mya 的 py 脚本
- [vmoranv/aola_code_panel_extract](https://github.com/vmoranv/aola_code_panel_extract)：根据 url 后缀=code/doc 和 cls=后缀=MainPl/MainPanel 提取活动路径并封装为 mya 封包

## 6. 实际案例分析

[奇灵神树月副本案例](<https://github.com/vmoranv/aolamya/blob/master/%E5%A5%87%E7%81%B5%E7%A5%9E%E6%A0%91/%E5%A5%87%E7%81%B5%E7%A5%9E%E6%A0%91%E6%9C%88%E5%89%AF%E6%9C%AC(%E7%99%BE%E7%94%B0%E5%BC%B1%E6%99%BA%E7%A8%8B%E5%BA%8F%E7%8C%BFindex%E5%92%8Ctype%E6%95%B0%E5%AD%97%E9%83%BD%E4%B8%8D%E4%BC%9A%E5%A1%AB%E8%8D%89%2C%E8%87%B3%E5%B0%911500%E4%B8%AA%E5%8C%85%E5%85%B3%E6%88%98%E6%96%97%E5%8A%A8%E7%94%BB).mya>)

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

行说明：

- line1: 使用自动战斗以适配不同时代的亚比
- line2: 刷新 boss 防止打不过还在反复打
- line3: 左边光之宝玉的战斗入口
- line4: 战斗发包每个包至少等待 500ms
- line5: 战斗事件开始 (preload 可以省略)
- line6: 等 5s (大概 20 回合)
- line7: 确认战斗结束
- line9: 获得光之灵气
- line13-20: 右边的暗之宝玉战斗入口，可以发现只是修改了包体的 index:0->1
- line22-27: 圣树升阶 6 扩展升级，同样遍历 index
- line29-31: 注入灵气，num 是灵气个数
- line33-34: 圣树压制
- line36-69: 成就奖励领奖 (tmd 不同界面 `index` 和 `type` 根本没有规律，艹)
