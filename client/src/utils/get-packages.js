/*
 * @Author: luna
 * @Date: 2020-07-02 16:51:48
 * @LastEditTime: 2020-07-02 18:11:44
 * @Description: 根据pages进行分包
 */ 

export default function getPackages(list) {
  let m = new Map();
  let packages = [];
  list.forEach(v=>{
    let arr = v.split('/');
    let root = arr.splice(0,3).join('/');
    let pages = arr.join('/');
  
    if(m.get(root)){
      let s = m.get(root);
      m.set(root,[...s, pages]);
    }else{
      m.set(root,[pages]);
    };
  });
  for(let [key,value] of m){
    packages.push({
      root: key,
      name: key.split('/')[2],
      pages: value,
    })
  }

return packages;
}



