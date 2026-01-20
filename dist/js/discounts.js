//checks if a given discount is available    
function checkDiscount(discount) {
    return discounts.available.includes(discount) || discounts.current === discount

}

// validates the discount written in the input field and adds the discount value to the price
function addDiscount() {
    const discount = $ID("discount_field").value
    if (checkDiscount(discount) && ($ID("item_count").innerText != "0")) {
        $ID("discount_code").innerText = discount;
        $ID("discount").innerText = "-$" + round(getDiscountValue(discount), 2)
        updateTotalPrice()
        updateDiscount(discount, false)
        return true
    } else {
        $ID("discount_field").value = "";
        $ID("discount_code").innerText = "";
        $ID("discount").innerText = "-$ " + 0
        updateTotalPrice()
        return false
    }
}