<template>
  <card-slot class="note-card">
    {{ title }}
    <transition name="fade" mode="out-in">
      <card-slot class="note-card__tasks">
        <div v-if="todos.filter(item => item.isFinished !== true).length > 0">
          <div
            class="note-card__tasks-item"
            v-for="(item, index) in todos.filter(item => item.isFinished !== true).slice(0,3)"
            :key="index"
          >
            {{ item.text }}
          </div>
        </div>
        <div v-else>
          В данный момент задач нет
        </div>
        <div class="note-card__task-actions">
          ...
          <div class="note-card__task-actions-icons-box">
            <router-link class="note-card__link" :to="'/notes/' + id">
              <edit-icon class="note-card__task-actions-icon" />
            </router-link>
            <delete-icon @click="deleteCard(id)" class="note-card__task-actions-icon" />
          </div>
        </div>
      </card-slot>
    </transition>
  </card-slot>
</template>

<script>
import CardSlot from "@/components/elements/CardSlot.vue";
import EditIcon from "@/assets/svg/EditIcon.vue";
import DeleteIcon from "@/assets/svg/DeleteIcon.vue";
export default {
  emits: ["deleteCard"],
  components: {
    CardSlot,
    EditIcon,
    DeleteIcon
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: "title"
    },
    todos: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    function deleteCard (id) {
      emit("deleteCard", id)
    }
    return {
      deleteCard
    }
  },
};
</script>


<style lang="scss" scoped>
.note-card {
  position: relative;
  &:hover {
    .note-card__tasks {
      display: block;
    }
  }
  &__link {
    text-decoration: none;
    color: #FFF;
    margin: 0 10px 0 0;
  }
  &__tasks {
    z-index: 2;
    display: none;
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
  }
  &__tasks-item {
    padding: 0 0 2px 0;
    border-bottom: 1px solid #dd4b39;
    margin: 0 0 10px 0;
  }
  &__task-actions {
    margin: 40px 0 0 0;
    display: flex;
    justify-content: space-between;
    &-icon {
      transition: background-color .3s;
      border-radius: 5px;
      &:hover {
        background-color: #dd4b39;
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>