const { GET } = require('../../helpers/service')
const authenModel = require('../authen/authenModel')

exports.onGenerateHeaderReport = async (data = []) => {
    const strArr = [];
    const headerArr = await Promise.all(data.map(async (e) => {
        try {
            let str = '';
            const result = await GET(e.form_url);
            if (result && !result.code) {
                const { data: d } = result;
                str = d.map(el => el.name).join(',');
                strArr.push(str)
                return {
                    colStr: str,
                    result: {
                        ...e,
                        data: d
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }))
    const arr = [...new Set(strArr)].map((e, i) => ({ name: 'Sheet ' + (i + 1), colStr: e, result: [] }))
    return headerArr.filter(e => e).reduce((acc, cur) => {
        const findIndex = acc.findIndex(e => e.colStr === cur.colStr);
        acc[findIndex].result.push(cur.result);
        return acc
    }, arr)
}

exports.option_station = [{
    value: 'PENDING',
    label: 'Under review'
},
{
    value: 'APPROVED',
    label: 'Approved'
}]

exports.option_urgency = [{
    value: 'it_method',
    label: 'ตามขั้นตอนไอที'
},
{
    value: 'urgent',
    label: 'เร่งด่วน'
}]

exports.onGetUserDetail = async ({ lark_id }) => {
    try {
        const query = await authenModel.onGetUserDetail({ lark_id });
        if (!query || query.length <= 0) {
            return { lark_id, name: '', dplus_name: '', dplus_id: '', email: '' }
        }
        const { dplus_name, name, dplus_id, email } = query[0]
        return { lark_id, dplus_name, name, dplus_id, email }
    } catch (error) {
        return { lark_id, name: '', dplus_name: '', dplus_id: '', email: '' }
    }
}

exports.convertStatusTimeLine = (str) => {
    if (!str) {
        return ''
    }

    switch (str) {
        case 'START': return 'Create Approval';
        case 'PASS': return 'Approve';
        case 'REJECT': return 'Reject';
        case 'COMMENT': return 'Comment';
        default: return str;
    }
}
