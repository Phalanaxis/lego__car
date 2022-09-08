<template>
  <div v-if="getFoundNote !== null">
    <div class="note__header">
      <h1 v-show="!isEditing" class="note__title" @click="switchEdit">
        {{ getFoundNote.title }}
        <edit-icon class="note__title-edit-icon" />
      </h1>
      <input
        v-show="isEditing"
        class="note__title-input"
        :value="getFoundNote.title"
        @input="inputHandler"
        @keydown.enter="endEdit"
      />
      <div class="note__actions">
        <button class="note__actions-save" @click="saveToLocal()" >
          Сохранить
        </button>
        <button class="note__actions-save" @click="cancelRedacting()">
          Отменить
        </button>
        <cancel-icon :class="{'note__cancel-change': true, 'note__cancel-change_disabled': getHistory.length === 0}" @click="cancelLastChange" />
        <cancel-icon :class="{'note__repeat-change': true, 'note__repeat-change_disabled': getForwardHistory.length === 0}" @click="repeatChange" />
        <button class="note__actions-delete" @click="deleteItemNote()">
          <delete-icon class="note__actions-delete-icon" />
        </button>
      </div>
    </div>
    <hr class="note__divider" />
    <div class="note__todo-list">
      <TodoItem
        v-for="item in filterByStatus(getFoundNote.todos)"
        :key="item.id"
        :id="item.id"
        :text="item.text"
        :isFinished="item.isFinished"
        @setTodoState="setTodoState"
        @deleteTodoItem="deleteTodoItem"
        @editTodoItem="editTodoItem"
      />
      <div class="note__add-button-container">
        <div class="note__add-new-item" @click="switchAdding">
          <plus-icon class="note__plus-icon" />
          <div v-show="!isAdding">Добавить</div> 
          <input
            v-show="isAdding"
            class="note__title-input note__new-task-input"
            @keydown.enter="addNewTask"
          />
        </div>
        <button
          @click="cancelAdding"
          class="note__cancel-adding"
          v-show="isAdding"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
  <modal-window v-if="isModal" @emitResult="modalResult" />
</template>

<script>
  import { ref, computed, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import TodoItem from "@/components/elements/TodoItem.vue";
  import DeleteIcon from "@/assets/svg/DeleteIcon.vue";
  import PlusIcon from "@/assets/svg/PlusIcon.vue";
  import EditIcon from "@/assets/svg/EditIcon.vue";
  import CancelIcon from "@/assets/svg/CancelIcon.vue"
  import ModalWindow from "@/components/elements/ModalWindow.vue";
  export default {
    components: {
      TodoItem,
      DeleteIcon,
      PlusIcon,
      EditIcon,
      CancelIcon,
      ModalWindow
    },
    setup() {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const getNotes = computed(() => store.getters.GET_NOTES)
      const getFoundNote = computed(() => store.getters.GET_FOUNDNOTE)
      const getHistory =  computed(() => store.getters.GET_HISTORY)
      const getForwardHistory =  computed(() => store.getters.GET_FORWARDHISTORY)
      const isModal = ref(false)
      const itemId = ref(0)
      const isEditing = ref(false)
      const isAdding = ref(false)
      const deleteType = ref('')

      const titleInput = ref('')

      function setTodoState (id, state) {
        // изменение состояние элемента туду (выполнено/невыполнено)
        saveChanges(getFoundNote.value)
        getFoundNote.value.todos.find(item => item.id === Number(id)).isFinished = state
      }
      function deleteTodoItem (id) {
        // удаление элемента туду
        itemId.value = id
        deleteType.value = "task"
        isModal.value = true
      }
      function editTodoItem (id, value) {
        // изменение элемента туду
        saveChanges()
        getFoundNote.value.todos.find(item => item.id === Number(id)).text = value
      }
      function switchEdit () {
        // переключение режима редактирования туду элемента
        isEditing.value = !isEditing.value
      }

      function inputHandler (e) {
        // запоминание значения title при вводе в инпу
        titleInput.value = e.target.value
      }

      function endEdit () {
        // установление значения title при вводе enter
        saveChanges(getFoundNote.value)
        getFoundNote.value.title = titleInput.value
        isEditing.value = false
      }

      function switchAdding () {
        // переклюение кнопки добавления в режим добавления
        isAdding.value = true
      }

      function addNewTask (e) {
        // добавление нового таска
        saveChanges(getFoundNote.value)
        let tempID = 0
        if (getFoundNote.value.todos.length > 0) {
          tempID = getFoundNote.value.todos[getFoundNote.value.todos.length - 1].id + 1
        }
        
        getFoundNote.value.todos.push({ "id": tempID, "text": e.target.value, "isFinished": false})
        isAdding.value = false
      }

      function cancelAdding () {
        // отмена добавления
        isAdding.value = false
      }

      function deleteItemNote () {
        // удаление всей заметки
        deleteType.value = "note"
        isModal.value = true
      }
      function modalResult (result) {
        // удаление заметки/задачи в зависимости от результата модального окна
        if (result === true) {
          if (deleteType.value === "task") {
            saveChanges(getFoundNote.value)
            getFoundNote.value.todos = getFoundNote.value.todos.filter(item => item.id !== itemId.value)
            isModal.value = false
          } else if (deleteType.value === "note") {
            store.commit("SET_NOTES", getNotes.value.filter(item => item.id !== getFoundNote.value.id))
            router.push({ path: "/" })
          }
        } else {
          isModal.value = false
        }
      }
      function saveToLocal () {
        // сохранение в localStorage
        const parsed = JSON.stringify(getNotes.value)
        localStorage.setItem("notes", parsed)
        router.push({ path: "/" })
      }
      function cancelRedacting () {
        store.commit("SET_NOTES", JSON.parse(localStorage.getItem("notes")))
        router.push({ path: "/" })
      }
      function filterByStatus (array) {
        return array.sort((a,b) => {
          if (a.isFinished > b.isFinished) {
            return 1
          }
          if (a.isFinished < b.isFinished) {
            return -1
          }
          return 0
        })
      }
      function saveChanges (local) {
        // сохранение истории изменений
        store.commit("CLEAR_HISTORY")
        let tempChange = JSON.parse(JSON.stringify(local))
        store.commit("ADD_HISTORY", tempChange)
      }
      function cancelLastChange () {
        // отмена изменения
        if (getHistory.value.length > 0) {
          store.commit("ADD_FORWARDHISTORY",  JSON.parse(JSON.stringify(getFoundNote.value)))
          store.commit("SET_FOUNDNOTE", JSON.parse(JSON.stringify(getHistory.value[getHistory.value.length - 1])))
          console.log(getForwardHistory.value)
          getHistory.value.pop()
        }
      }
      function repeatChange () {
        //  возврат отмененного изменения
        if (getForwardHistory.value.length > 0) {
          store.commit("ADD_HISTORY", JSON.parse(JSON.stringify(getFoundNote.value)))
          store.commit("SET_FOUNDNOTE", JSON.parse(JSON.stringify(getForwardHistory.value[getForwardHistory.value.length - 1])))
          getForwardHistory.value.pop()
        }
      }
      onMounted(() => {
        store.commit("SET_FOUNDNOTE", null)
        store.dispatch("searchNote", route.params.id).then(() => {
          titleInput.value = getFoundNote.value.title
        })
      })
      return {
        route,
        router,
        getNotes,
        getFoundNote,
        setTodoState,
        deleteTodoItem,
        editTodoItem,
        isModal,
        itemId,
        deleteItemNote,
        switchEdit,
        isEditing,
        endEdit,
        inputHandler,
        titleInput,
        addNewTask,
        switchAdding,
        isAdding,
        cancelAdding,
        modalResult,
        saveToLocal,
        cancelRedacting,
        filterByStatus,
        saveChanges,
        getHistory,
        cancelLastChange,
        getForwardHistory,
        repeatChange
      }
    },
  };
</script>

<style lang="scss" scoped>
  .note {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 20px 0;
      @media screen and (max-width: 680px) {
        flex-wrap: wrap;
      }
    }
    &__title {
      position: relative;
      border: 1px solid #1f1f1f;
      @media screen and (max-width: 680px) {
        width: 100%;
        margin: 30px 25px;
      }
    }
    &__title-edit-icon {
      position: absolute;
      transform: scale(0.5);
      top: -10px;
      right: -25px;
    }
    &__title-input {
      font-size: 32px;
      padding: 0;
      border: 1px solid #FFF;
      border-radius: 10px;
      color: #FFF;
      font-weight: 600;
      background-color: #1f1f1f;
    }
    &__new-task-input {
      font-size: 16px;
      font-weight: 400;
      border-radius: 5px;
      padding: 0 0 0 10px;
    }
    &__divider {
      border: none;
      border-bottom: 1px solid #dd4b39;
      margin: 0 0 40px 0;
    }
    &__todo-list {
      width: 50%;
      @media screen and (max-width: 1280px) {
        width: 100%;
      }
    }
    &__actions {
      display: flex;
      @media screen and (max-width: 680px) {
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
      }
      &-save {
        height: 37px;
        width: 100px;
        border-radius: 10px;
        color: #FFF;
        font-weight: 500;
        border: none;
        background-color: transparent;
        transition: background-color .3s;
        margin: 0 15px 0 0;
        cursor: pointer;
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        @media screen and (max-width: 680px) {
          margin: 0 0 40px 0;
          width: calc(50% - 10px);
          &:nth-child(1) {
            margin: 0 20px 0 0;
          }
        }
      }
      &-delete {
        border-radius: 5px;
        background-color: #dd4b39;
        border: none;
        cursor: pointer;
        transition: background-color .3s;
        &-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFF;
        }
        &:hover {
          background-color: #dd4c398a;
        }
      }
    }
    &__cancel-change {
      width: 36px;
      height: 37px;
      transform: scale(-1, 1);
      margin: 0 10px 0 0;
      cursor: pointer;
      background-color: #dd4b39;
      border-radius: 5px;
      transition: background-color .3s;
      &:hover {
        background-color: #dd4c398a;
      }
      &_disabled {
        background-color: grey;
        pointer-events: none;
        user-select: none;
      }
    }
    &__repeat-change {
      width: 36px;
      height: 37px;
      margin: 0 20px 0 0;
      cursor: pointer;
      background-color: #dd4b39;
      border-radius: 5px;
      transition: background-color .3s;
      &:hover {
        background-color: #dd4c398a;
      }
      &_disabled {
        background-color: grey;
        pointer-events: none;
        user-select: none;
      }
    }
    &__add-new-item {
      position: relative;
      height: 40px;
      margin: 20px 0 0 0;
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #dd4b39;
      display: flex;
      align-items: center;
    }
    &__plus-icon {
      transform: scale(1.5);
      fill: #dd4b39;
      margin: 0 20px 0 5px;
    }
    &__add-button-container {
      position: relative;
      cursor: pointer;
      border-radius: 10px 10px 0 0;
      transition: background-color .3s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    &__cancel-adding {
      height: 25px;
      position: absolute;
      top: 8px;
      right: 10px;
      color: #FFF;
      background-color: #dd4b39;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color .3s;
      &:hover {
        background-color: #dd4c398a;
      }
    }
  }
</style>