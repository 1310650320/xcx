var config={
   Host: "https://flower.xcx.vxiaoju.com",
  //  Host: 'https://ugo.vxiaoju.com',
   Appid: 'wxc6d217d10ac1dd54',
   AppSecret:'5ab53ed61f4d362908d37517dda33c8f',
   port: 443
}
var httpAPI={
  // 一步购买：one_step_buy----done
  // 购物车
  APIUserGetKey: '/api/user/getkey',
  // 商品相关
  APiHomeUrl:'/api/goods/goods_index',            // 首页数据
  APiClassfiryUrl:'/api/goods/goods_cate',        // 商品分类
  APishopInfo:'/api/goods/goods_list',            // 商品列表
  APishopDetail:'/api/goods/goods_detail',        // 商品详情
  APISearchUrl: '/api/goods/goods_search',        // 商品搜索
  // 购物车
  APiAddShopCarUrl: '/api/cart/in_car',           // 加入购物车
  APIShopCarUrl: '/api/cart/my_car',              // 我的购物车
  APICancleCarShopUrl:'/api/cart/delete_car',     // 删除购物车商品
  APISubmitOrderUrl:'/api/cart/noattr_change_cart_number', // 修改购物车然后提交（购物车立即结算---订单）
  // 地址相关
  APIAddaddressUrl: '/api/address/address_add',
  APIAddressListUrl: '/api/address/address_list',
  APIAddressDetailUrl: '/api/address/add_list_one',
  APICancleAddressurl:'/api/address/address_delete',
  APISetDefaultSiteUrl:'/api/address/set_default',
  APIregionUrl: '/api/address/region', 
  // 订单相关
  APIOneStepBuy: '/api/flow/one_step_buy',        // 一步购买
  APICheckOrder:'/api/flow/checkout',             // 确认订单 
  APIPayFlowDoneUrl: '/api/flow/done',            // 提交订单   submiteOrder
  APIWxPayUrl: '/api/pay/wxpay',                 // 支付
  APIOrderUrl: '/api/order/order_list',           // 订单列表
  APIOrderDetailUrl: '/api/order/order_detail',   // 订单详情
  APIOrderCancleUrl: '/api/order/order_cancel',   // 取消订单
  APIConfirmTakeUrl: '/api/order/order_received', // 确认收货
  APICancleOrderUrl: '/api/order/order_delete',   // 删除订单
  APIordertrackingUrl: '/api/order/order_tracking', // 查看物流
  
  // 会员卡相关
  APIMyUserCard:'/api/user/user_card',      // 我的会员卡
  APIGetUserCard:'/api/user/get_user_card', // 申请会员卡
  APIIsGetCode:'/api/user/test_code', // 验证验证码
  ApiUrlContact: '/api/goods/info'              // 联系我们
  // APILotteryList:'/api/extend/extend_show',   活动插件
  // APIGetUserPoints: '/api/user/user_points',
  // APIGetUserBonus:'/api/user/user_bonus',                  //获取红包
  // APIGetUserFavList: '/api/user/users_favourable_list',    //获取优惠券列表
  // APIGetUserFavMyList: '/api/user/users_favourable_mylist',//获取我的优惠券列表
  // APIGetUserFavGet: '/api/user/users_favourable_get',      //获得优惠券
  // APILotteyAction:'/api/extend/extend_dzp_action',
  // APIGetSmsCode:'/api/user/get_smscode',                   //获取验证码
  // APICheckSmsCode:'/api/user/check_smscode',               //检验验证码
  // APIIsRegister: '/api/user/is_register'                   //是否绑定了手机号
  
}
module.exports = config
module.exports.httpAPI = httpAPI
