export let data = [];

export function removeItem(itemToRemove) {

    const index = data.findIndex(item => item.param === itemToRemove.param);
    if (index !== -1) {
        data.splice(index, 1);
    }
}

export function addBack(object) {
    data.push(object)
    data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
}

export function setData(passedData){
    data = passedData
}