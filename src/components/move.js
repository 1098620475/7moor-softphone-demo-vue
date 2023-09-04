/*
 * @Author: Wangtao
 * @Date: 2022-11-04 13:45:37
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-25 16:01:21
 */
function mousedownFnWrap (x, y, dragable) {
  // 初次渲染时，top和left的位置
  let baseX = x, baseY = y;
  // 鼠标按下事件
  return function mousedownFn (event) {
    let startX = event.clientX;
    let startY = event.clientY;
    let bodyWidth = document.body.clientWidth;
    let bodyHeight = document.body.clientHeight;
    console.log(startX);
    // 鼠标移动事件
    let move = (event) => {
      let top = baseY + event.clientY - startY;
      let left = baseX + event.clientX - startX;
      if (top < 0) {
        top = 0;
      } else if (top + 50 >= bodyHeight) {
        top = bodyHeight - 50;
      }
      if (left < 0) {
        left = 0;
      } else if (left > (bodyWidth - 320)) {
        left = bodyWidth - 320;
      }

      dragable.style.top = `${top}px`;
      dragable.style.left = `${left}px`;
    };
    // 鼠标抬起事件
    let up = (event) => {
      baseX = baseX + event.clientX - startX;
      baseY = baseY + event.clientY - startY;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };
}

function inserted (dragable, { value }) {
  let baseX = value && value.left || 0, baseY = value && value.top || 0;
  dragable.style.top = `${baseY}px`;
  dragable.style.left = `${baseX}px`;
  const mousedownFn = mousedownFnWrap(baseX, baseY, dragable);
  dragable.__mousedownFn__ = mousedownFn;
  dragable.addEventListener('mousedown', mousedownFn);
}

function unbind (dragable) {
  console.log(0);
  dragable.removeEventListener('mousedown', dragable.__mousedownFn__);
}

export default {
  inserted,
  unbind
};
