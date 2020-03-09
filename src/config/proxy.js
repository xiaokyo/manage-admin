const proxy = {
  "/app": "http://app.test.com/", // http://app.test.com/ http://192.168.5.197:6164/
  "/cj-erp": "http://erp.test.com/", // http://erp.test.com/ http://192.168.5.197:6163/
  "/erp": "http://erp1.test.com/", // http://erp1.test.com/ http://192.168.5.197:6164/
  "/storage": "http://storage.test.com/",
  "/caigou": "http://caigou.test.com/",
  "/tool": 'http://tools.test.com/',
  '/order': "http://order.test.com/",
  "/cj": 'http://app1.test.com/',
  "/fulfillment": "http://fulfillment.test.com/",
  "/source": "http://sourcing.test.com/",
  "/newlogistics": "http://logistics2.test.com/",
  "/mail": "http://cjmail.test.com/",
  "/_logistics": "http://dsp-logist.test.com/",
  "/supplier": "http://supplier1.test.com/",
  // "/supplier": "http://192.168.5.187:8077/"
  "/robot": "http://chat.test.com/",
  "/message": "http://chat.test.com/",
  "/product": "http://47.254.77.240:8000/",// 商品档案线上环境
  "/warehousereceipt": "http://erp.test.com/",
  "/control": "http://192.168.5.212:8183/",  //权限系统
}

module.exports = proxy