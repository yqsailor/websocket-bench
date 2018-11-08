/**
 * @description
 * @author yq
 * @date 2018/9/27 下午8:58
 */
module.exports = {
  //可选，在建立连接之前会执行
  beforeConnect: function(client){
  },
  //必选，建立连接后所要做的事情
  onConnect: function(client, done){
    //向服务器发送消息
    //client 为客户端的连接实例
    client.emit('subscribe', getChannels());
    // client.emit('subscribe', 'kline.1m@binance_btc_usdt,depth@binance_btc_usdt');
    // sendPing(client);
    // send(client, done, 0);
    //回调函数
    done();
  },
  //必选，向服务器发送消息时运行的代码
  sendMessage: function(client, done) {
    client.emit('subscribe', getChannels());
    setTimeout(() => done(), 3000);
    // client.emit('subscribe', getErrorChannels());
    // done();
  },
  options : {
    path: '/ws',
    transports: ['websocket'],
  }
};

function send(client, done, count) {
  if (count >= 100) return done();
  client.emit('subscribe', getChannels());
  setTimeout(() => send(client, done, count + 1), 1000);
}

function getChannels(){
  const symbols = ["binance_btc_usdt", "binance_eth_usdt", "binance_eos_usdt", "binance_xrp_usdt", "binance_xlm_usdt", "binance_ada_usdt", "binance_bcc_usdt", "binance_ltc_usdt"];
  const priceChannels = symbols.map((item) => `price@${item}`).join(",");
  // const klineIntervals = ['1m', '5m', '15m', '30m', '1h', '6h', '1d'];
  // const klineChannels = klineIntervals.map((item) => `kline.${item}@binance_btc_usdt`).join(",");

  return `kline.1m@binance_btc_usdt,depth@binance_btc_usdt,${priceChannels}`;
}

function getErrorChannels(){
  let channels = [];
  for (let i = 0; i < 1000; i ++) {
    channels.push(Math.random())
  }
  return channels.join(",");
}
