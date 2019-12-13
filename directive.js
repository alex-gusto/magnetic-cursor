Vue.directive('cursor', {
  inserted (el, { value = { padding: 50 } }) {
    const { padding } = value
    const wrapper = document.createElement('div')
    wrapper.style.cssText =  `
      padding: ${padding}px;
      margin: -${padding}px;
    `
    const clone = el.cloneNode(true)
    wrapper.appendChild(clone)
    const parent = el.parentNode
    parent.replaceChild(wrapper, el)
    
    const bounds = wrapper.getBoundingClientRect();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const radius = bounds.width / 2 - padding
    
    wrapper.addEventListener('mouseleave', onMouseLeave)     
    wrapper.addEventListener('mousemove', onMouseMove)  

    function onMouseLeave() {
       TweenMax.to(clone, 0.3, { x: 0, y: 0 })
    }
    
    function onMouseMove(e){
      const { pageX, pageY } = e

      const deltaX = pageX - centerX;
      const deltaY = pageY - centerY;

      const D = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
      if ( D <= Math.pow(radius, 2) || D >= Math.pow(radius + padding, 2)) {
        TweenMax.to(clone, 0.5, { x: 0, y: 0 })
      } else {
        const alpha = Math.atan2(deltaY, deltaX);
        const delta = deltaX / Math.cos(alpha) - radius;
        const translateX = Math.cos(alpha) * delta;
        const translateY = Math.sin(alpha) * delta;
        TweenMax.to(clone, 0.5, { x: translateX * 1.5 , y: translateY * 1.5 })
      }
    }
  }
})

new Vue({
  el: "#app",
  components:{
    VButton: {
      template:'<button class="button" v-cursor="{ padding: 100 }">Ховер</button>'
    }
  },
  render(h) {   
    const button = h('VButton')
    const div = h('div', {staticClass: 'content'}, [button])
    return h("div", { staticClass: "wrapper" }, [div]);
  }
});
