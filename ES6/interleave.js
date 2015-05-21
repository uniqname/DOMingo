export default function (arr1, arr2) {
    return arr1.reduce( (interleaved, item, i) => {
        let arr2Item = arr2[i];
        interleaved.push(item);
        // console.log(interleaved);
        if (arr2Item !== undefined) {
            interleaved.push(arr2Item);
            // console.log(interleaved);
        }
        return interleaved;
    }, []);
}
