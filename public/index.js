// var shortUrl = document.getElementsByClassName('shorturl');
// var longUrl = document.getElementsByClassName('longurl');
// console.log(shortUrl);
// var m = new Map();
// var capacity = 100;

// console.log(shortUrl.length);

// for (let idx = 0; idx < shortUrl.length; idx++) {
//     shortUrl[idx].addEventListener("click", () => {
//         var key = shortUrl[idx].href
//         var value = longUrl[idx].href;

//         console.log(key, "  ", value);
//         if (m.has(key)) //remove it and add it back with new value
//         {
//             m.delete(key);
//             m.set(key, value);
//             window.open(value, '_blank');
//         } else if (m.size == capacity) //remove the first key (Map adds new keys to the back)
//         {
//             var first_key = m.keys().next().value;
//             m.delete(first_key);
//             m.set(key, value);
//         } else {  //Map has extra capacity
//             m.set(key, value);
//         }
//         console.log("end")
//     });
// }

