<template>
  <div
    :class="{'todo__item': true, 'todo__item_disabled': isFinished}"
  >
    <input
      type="checkbox"
      class="todo__custom-checkbox"
      :id="id"
      value="true"
      v-model="isChecked"
      @change="setState(id)"
    >
    <label
      :class="{'todo__item-text': true, 'todo__item-text_disabled': isFinished}"
      :for="id"
    >
      <div v-show="!isEdited">{{ textInput }}</div>
      <input
        class="todo__item-input"
        v-show="isEdited"
        :value="textInput"
        @input="inputHandler"
        @keydown.enter="endEdit(id)"
      />
    </label>
    <edit-icon v-if="!isFinished" class="edit-icon" @click="editEvent()" />
    <delete-icon class="delete-icon" @click="deleteEvent(id)" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import DeleteIcon from "@/assets/svg/DeleteIcon.vue";
import EditIcon from "@/assets/svg/EditIcon.vue";
export default {
  emits: ["setTodoState", "deleteTodoItem", "editTodoItem"],
  components: {
    DeleteIcon,
    EditIcon
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: "text",
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { emit }) {
    const isChecked = ref(props.isFinished)
    const isEdited = ref(false)
    const textInput = ref('')

    function setState (id) {
      if (isChecked.value === true && isEdited.value === true) {
        isEdited.value = false
      }
      emit("setTodoState", id, isChecked.value)
    }

    function deleteEvent (id) {
      emit("deleteTodoItem", id)
    }

    function editEvent () {
      isEdited.value = !isEdited.value
    }

    function inputHandler (e) {
      textInput.value = e.target.value
    }

    function endEdit (id) {
      emit("editTodoItem", id, textInput.value)
      isEdited.value = false
    }

    onMounted(() => {
      isChecked.value = props.isFinished
      textInput.value = props.text
    })
    return {
      isChecked,
      isEdited,
      setState,
      textInput,
      deleteEvent,
      editEvent,
      inputHandler,
      endEdit
    }
  }
};
</script>

<style lang="scss" scoped>
  .todo {
    &__item {
      position: relative;
      padding: 0 60px 10px 0;
      border-bottom: 1px solid #dd4b39;
      transition: border-color .1s;
      margin: 0 0 10px 0;
      &_disabled {
        border-color: gray;
      }
    }
    &__item-input {
      font-size: 16px;
      padding: 0;
      border: 1px solid #FFF;
      border-radius: 5px;
      padding: 0 0 0 10px;
      color: #FFF;
      font-weight: 400;
      background-color: #1f1f1f;
    }
    &__item-text {
      transition: color .1s;
      &_disabled {
        text-decoration: line-through;
        color: grey;
        &::before {
          border-color: grey;
          background-color: grey;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
        }
      }

    }
    &__custom-checkbox {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }
    &__custom-checkbox + label {
      display: inline-flex;
      align-items: center;
      user-select: none;
      cursor: pointer;
    }
    &__custom-checkbox + label::before {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      flex-grow: 0;
      border: 1px solid #adb5bd;
      border-radius: 5px;
      margin-right: 20px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50% 50%;
      transition: border-color .3s, background-color .1s;
    }
    // &__custom-checkbox:checked + label::before {
    //   border-color: grey;
    //   background-color: grey;
    //   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
    // }
  }
  .delete-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
  .edit-icon {
    position: absolute;
    top: 0;
    right: 30px;
    cursor: pointer;
  }
</style>