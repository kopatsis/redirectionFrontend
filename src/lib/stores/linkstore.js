export let data = [];

export function removeItem(itemToRemove) {

    const index = data.findIndex(item => item.param === itemToRemove.param);
    if (index !== -1) {
        data.splice(index, 1);
    }
}

export function updateItem(object) {
    const index = data.findIndex(item => item.param === object.param);
    if (index !== -1) {
        data[index].url = object.url;
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
    console.log(data)
}