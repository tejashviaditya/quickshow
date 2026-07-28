export const dateFormat=(date)=>{
    return new Date(date).toLocaleDateString('en-US',
        {weekday:'short'
        ,
        hour:'numeric',
        minute:'numeric',
        month:'long',
        day:'numeric'
    })}
export default dateFormat;
