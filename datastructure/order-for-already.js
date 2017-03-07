
// 套餐子项单品
var combo_choose_info_item = {
	name: "在家", // 套餐子项中的单品名字

	num: 1, // 套餐子项中的单品数量

	choose_info: "12、1", // 如果是有属性组的套餐子项单品，则按照这种格式传给我：[12, 1].join("、")

}


// 订单内的order子项，满送的子项也走这里，然后设置其name、num(1)、order_init_price(0)、dc_str("满送")，即可
var order_item = {
	
	dc_str: "9.5折", // 单品折扣信息，当dc_type为limit时，建议写限量优惠，无则填空字符串吧

	dc_type: "discount", // 优惠信息

	name: "上汤菜心", // 单品名称

	order_init_price: 29, // 不算优惠的时候价格，但要把属性差价算进去。

	tag: "test", // 标签备注

	type: "normal", // 单品类型

	num: 2, // 点了的数量

	choose_info: "12、1", // 如果是有属性组的单品，则按照这种格式传给我：[12, 1].join("、")

	// 套餐子项单品组
	combo_choose_info: [
		combo_choose_info_item,
		combo_choose_info_item
	]


}


// 一个订单item
var item = {
    create_time: 1484462900143, // 订单创建时间

    // 折扣信息map, 对应每一项折扣产生的优惠
    discount_map: {
        discount: 67.58000000000001,
        half: 0,
        reduce: 22,
        sale: 0,

        // 此为会员产生的优惠
        user_discount: 14.19
    },

    // 订单其他信息
    order_info: {
        description: "玫瑰过敏", // 备注
        flow_id: "0001", // 流水号
        order_id: 8467077853, // 订单号
        pay_info: "微信支付", // 支付方式
        table_info: "堂食 6 号桌" //桌位信息
    },
    order_total_number: 30,
    total_final_price: 1457.23,
    order_items: [
    	order_item,
    	order_item
    ];
}


// 已点订单组
var order_for_already = [
    item,
    item
    ...
];

module.exports = order_for_already;