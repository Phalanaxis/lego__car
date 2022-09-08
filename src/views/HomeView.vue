<template>
  <h1 class="notes__title">Notes // <i>на инпутах enter для ввода</i></h1>
  <hr class="notes__divider" />
  <div class="notes__list">
    <note-card
      v-for="(item, index) in getNotes"
      :key="index"
      class="notes__item"
      :id="item.id"
      :title="item.title"
      :todos="item.todos"
      @deleteCard="deleteCard"
    />
      <card-slot class="notes__add-card" @click="switchCreate()">
        <div class="notes__add-card-text" v-show="!isCreateActive">Add new Card</div>
        <input
          v-show = "isCreateActive"
          class="notes__add-card-input"
          @keydown.enter="addNewTask"
        />
        <div class="notes__icon-add">
          <plus-icon />
        </div>
      </card-slot>
  </div>
  <modal-window v-if="isModal" @emitResult="modalResult" />
</template>

<script>
  import { ref, computed, onMounted } from "vue";
  import { useStore } from "vuex";
  import NoteCard from "@/components/elements/NoteCard.vue"
  import CardSlot from "@/components/elements/CardSlot.vue"
  import PlusIcon from "@/assets/svg/PlusIcon.vue"
  import ModalWindow from "@/components/elements/ModalWindow.vue";
  export default {
    components: {
      NoteCard,
      CardSlot,
      PlusIcon,
      ModalWindow
    },
    setup () {
      const store = useStore()
      const getNotes = computed(() => store.getters.GET_NOTES)
      const noteId = ref(0)
      const isCreateActive = ref(false)

      const isModal = ref(false)
      function deleteCard (id) {
        isModal.value = true
        noteId.value = id
      }
      function modalResult (result) {
        if (result === true) {
          store.commit("SET_NOTES", getNotes.value.filter(item => item.id !== noteId.value))
          saveToLocal()
        }
        isModal.value = false
      }

      function switchCreate () {
        isCreateActive.value = true
      }

      function addNewTask (e) {
        let tempId = 0
        if (getNotes.value.length > 0) {
          tempId = getNotes.value[getNotes.value.length - 1].id + 1
        }
        store.commit("ADD_NOTE", {
          "id": tempId,
          "title": e.target.value,
          "todos": []
        })
        saveToLocal()
        isCreateActive.value = false
      }

      function saveToLocal () {
        const parsed = JSON.stringify(getNotes.value)
        localStorage.setItem("notes", parsed)
      }

      onMounted(() => {
        if(localStorage.getItem("notes")) {
          store.commit("SET_NOTES", JSON.parse(localStorage.getItem("notes")))
        }
      })
      return {
        isModal,
        isCreateActive,
        getNotes,
        deleteCard,
        modalResult,
        switchCreate,
        addNewTask
      }
    }
  };
</script>

<style lang="scss" scoped>
  .notes {
    &__title {
      margin: 0 0 20px 0;
    }
    &__divider {
      border: none;
      border-bottom: 1px solid #dd4b39;
      margin: 0 0 40px 0;
    }
    &__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 280px);
      grid-gap: 20px;
      @media screen and (max-width: 1280px) {
        grid-template-columns: 1fr 1fr;
      }
      @media screen and (max-width: 680px) {
        grid-template-columns: 1fr;
      }
    }
    &__item {
      width: 280px;
      @media screen and (max-width: 1280px) {
        width: 100%;
      }
    }
    &__icon-add {
      padding: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      transition: background-color .3s;
    }
    &__add-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg {
        fill: #dd4b39;
        transition: fill .3s;
        border-radius: 10px;
      }
      &:hover {
        .notes__icon-add {
          background-color: #dd4b39;
        }
        svg {
          fill: rgba(255, 255, 255, 0.87);
        }
      }
      &-text {
        border: 1px solid transparent;
      }
      &-input {
        padding: 0;
        border: 1px solid #FFF;
        border-radius: 5px;
        background-color: #282828;
        color: #FFF;
      }
    }
  }
</style>