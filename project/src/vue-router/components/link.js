export default {
  functional: true,
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: "a"
    }
  },
  render(h, { props, slots, parent }){
    const data = {}
    const { mode } = parent.$router;
    if(mode == "hash" && props.tag == "a"){
      data.attrs = {
        href: "#" + props.to
      }
    }else{
      data.on = {
        click: () => {
          if(mode == "hash"){
            location.hash = "#" + props.to;
          }else{
            history.pushState(null, null, props.to);
            parent.$route.path = props.to;
          }
        }
      }
    }
    return h(props.tag, data, slots().default);
  }
}