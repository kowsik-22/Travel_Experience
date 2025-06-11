import add_img from '../../src/assets/images/empty.svg'
import search_img from '../../src/assets/images/search.svg'
import date_img from '../../src/assets/images/date.svg'

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


export const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    let initials = "";
    for(let i = 0; i < Math.min(names.length, 2); i++) {
        initials += names[i][0].toUpperCase();
    }
    return initials;
};


export const getEmptyCardMsg =(filterType)=>{
    switch(filterType){
        case "search":
            return "Oops, No blogs match your search !"
        
        case "date":
            return "No blogs found in the selected date range !"
        
        default:
            return "Start publishing your travel experience \n Let the world know !"
    }
}


export const getEmptyCardImg =(filterType)=>{
    switch(filterType){
        case "search":
            return search_img;
        
        case "date":
            return date_img;
        
        default:
            return add_img;
    }
}
