export { rmb };

const numbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const leftUnits = ['元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '万', '拾', '佰', '仟', '万'];
const rightUnits = ['角', '分'];

function rmb(value: number) {
    if (Object.prototype.toString.call(value) === '[object Number]' && value >= 0.01) {
        const fragment: any = [];
        const [leftValues, rightValues] = String(value).split('.').map(part => part.split('').map(i => Number(i)));

        const leftValueLength = leftValues.length; // 整数部分位数
        const unit1 = leftValueLength - 1; // 元位
        const unit5 = leftValueLength - 5; // 万位
        const unit9 = leftValueLength - 9; // 亿位
        const unit13 = leftValueLength - 13; // 万亿位
        const unit17 = leftValueLength - 17; // 万万亿位
        const hasLeftValue = leftValueLength > 1 || leftValues[0] > 0; // 整数部分不为0
        const hasRightValue = rightValues && (rightValues[0] > 0 || rightValues[1] > 0); // 小数部分不为0
        const has678Value = leftValues[unit5 - 1] > 0 || leftValues[unit5 - 2] > 0 || leftValues[unit5 - 3] > 0; // 拾万、佰万或仟万位不为0
        const overflowIndex = leftValueLength - leftUnits.length; // 溢出位索引

        let leftUnitIndex = 0;
        for (let i = leftValueLength - 1; i >= 0; i--) {
            if (leftValues[i] === 0 && (i === unit5 || i === unit9 || i === unit13 || i === unit17) && leftValues[i + 1] > 0) {
                // 当前位为0，且当前位为万、亿、万亿、万万亿，且低一位不为0
                fragment.unshift({type:'number', value:numbers[leftValues[i]]});
            }

            if ((leftValues[i] > 0) || (i === unit1 && hasLeftValue) || (i === unit5 && has678Value) || i === unit9 || i === unit13 || i === unit17) {
                // 元、万、亿、万亿、万万亿或当前位不为0
                fragment.unshift({type:'unit', value:leftUnits[leftUnitIndex]});
            }

            if (leftValues[i] > 0 || (leftValues[i + 1] > 0 && i !== unit5 && i !== unit9 && i !== unit13 && i !== unit17) || i <= overflowIndex) {
                // 当前位不为0，或低一位不为0且当前位非万、亿、万亿、万万亿，或当前为溢出位
                fragment.unshift({type:'number', value:numbers[leftValues[i]]});
            }

            leftUnitIndex++;
        }

        if (hasRightValue) {
            // 角
            if (rightValues[0] > 0 || hasLeftValue) { // 角位不为0，或整数位不为0
                fragment.push({type:'number', value:numbers[rightValues[0]]});
            }
            if (rightValues[0] > 0) { // 角位不为0
                fragment.push({type:'unit', value:rightUnits[0]});
            }
            // 分
            if (rightValues[1] > 0) {
                fragment.push({type:'number', value:numbers[rightValues[1]]});
                fragment.push({type:'unit', value:rightUnits[1]});
            }
        } else { // 没有小数位
            fragment.push({type:'cut', value:'整'});
        }
        return fragment;
    }
    return [
        {type:'number', value:'零'},
        {type:'unit', value:'元'},
        {type:'cut', value:'整'},
    ];
};