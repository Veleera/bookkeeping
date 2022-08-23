export function AsyncLoadCSV<T>(url:string) : Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          // console.log(JSON.parse(xhr.response));
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr.status);
        }
      }
    };
  });
}