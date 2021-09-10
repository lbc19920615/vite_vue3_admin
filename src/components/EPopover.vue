<script lang="ts">
const SHOW_EVENT = "show";
const HIDE_EVENT = "hide";
import {
  defineComponent,
  Fragment,
  createTextVNode,
  renderSlot,
  toDisplayString,
  createCommentVNode,
  withDirectives,
  Teleport,
  h,
} from 'vue'
import { ClickOutside } from 'element-plus/es/directives/index.js'
import ElPopper from 'element-plus/es/components/popper/index.js'
import {
  popperDefaultProps,
  Effect,
  renderArrow,
  renderPopper,
  renderTrigger,
} from 'element-plus/es/components/popper/index.js'
import { warn } from 'element-plus/es/utils/error.js'
import { renderIf, PatchFlags } from 'element-plus/es/utils/vnode.js'
import usePopover from 'element-plus/es/components/popover'
import type { PropType } from 'vue'
import type { TriggerType } from 'element-plus/es/components/popper/index.js'
const emits = [
  'update:visible',
  'after-enter',
  'after-leave',
  SHOW_EVENT,
  HIDE_EVENT,
]
const NAME = 'EPopover'
const _hoist = { key: 0, class: 'el-popover__title', role: 'title' }
export default defineComponent({
  name: NAME,
  components: {
    ElPopper,
  },
  props: {
    ...popperDefaultProps,
    content: {
      type: String,
    },
    trigger: {
      type: String as PropType<TriggerType>,
      default: 'click',
    },
    title: {
      type: String,
    },
    transition: {
      type: String,
      default: 'fade-in-linear',
    },
    width: {
      type: [String, Number],
      default: 150,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    tabindex: [String, Number],
    visible: Boolean
  },
  emits,
  setup(props, ctx) {
    if (props.visible && !ctx.slots.reference) {
      warn(
          NAME,
          `
        You cannot init popover without given reference
      `
      )
    }
    const states = usePopover(props, ctx)
    return states
  },
  render() {
    const { $slots } = this
    const trigger = $slots.reference ? $slots.reference() : null
    const title = renderIf(
        Boolean(this.title),
        'div',
        _hoist,
        toDisplayString(this.title),
        PatchFlags.TEXT
    )
    const content = renderSlot($slots, 'default', {}, () => [
      createTextVNode(toDisplayString(this.content), PatchFlags.TEXT),
    ])
    const {
      events,
      onAfterEnter,
      onAfterLeave,
      onPopperMouseEnter,
      onPopperMouseLeave,
      popperStyle,
      popperId,
      popperClass,
      showArrow,
      transition,
      visibility,
      tabindex,
    } = this
    const kls = [
      this.content ? 'el-popover--plain' : '',
      'el-popover',
      popperClass,
    ].join(' ')
    const popover = renderPopper(
        {
          effect: Effect.LIGHT,
          name: transition,
          popperClass: kls,
          popperStyle,
          popperId,
          visibility,
          onMouseenter: onPopperMouseEnter,
          onMouseleave: onPopperMouseLeave,
          onAfterEnter,
          onAfterLeave,
          stopPopperMouseEvent: false,
        },
        [title, content, renderArrow(showArrow)]
    )
    // when user uses popover directively, trigger will be null so that we only
    // render a popper window for displaying contents
    const _trigger = trigger
        ? renderTrigger(trigger, {
          ariaDescribedby: popperId,
          ref: 'triggerRef',
          tabindex,
          ...events,
        })
        : createCommentVNode('v-if', true)
    return h(Fragment, null, [
      this.trigger === 'click'
          ? withDirectives(_trigger, [[ClickOutside, this.hide]])
          : _trigger,
      h(
          Teleport as any,
          {
            disabled: !this.appendToBody,
            to: 'body',
          },
          [popover]
      ),
    ])
  },
})
</script>
