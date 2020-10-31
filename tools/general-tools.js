const general_tools = {
    format_date
}


//******************************************************************************** */
//                              format date to standard
//******************************************************************************** */

function format_date(date) 
{
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2) {
        month = '0' + month;
    }
        
    if (day.length < 2) {
        day = '0' + day;
    }
        
    return [year, month, day].join('/');
}




module.exports = general_tools;