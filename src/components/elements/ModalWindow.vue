<template>
  <div class="modal__modal-background" />
  <div class="modal__delete-modal">
    <div class="modal__delete-modal-text">Желаете удалить?</div>
    <div class="modal__delete-actions">
      <button class="modal__delete-button" @click="emitResult(true)" >
        ДА
      </button>
      <button class="modal__delete-button" @click="emitResult(false)" >
        НЕТ
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["emitResult"],
  setup(props, { emit }) {
    function emitResult(result) {
      emit("emitResult", result)
    }
    return {
      emitResult
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal {
    &__modal-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }
    &__delete-modal {
      position: fixed;
      top: calc(50% - 100px/2);
      left: calc(50% - 250px/2);
      width: 250px;
      height: 100px;
      padding: 20px;
      border: 1px solid #dd4b39;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    &__delete-modal-text {
      text-align: center;
    }
    &__delete-actions {
      display: flex;
      justify-content: space-between;
    }
    &__delete-button {
      padding: 5px 35px;
      border-radius: 5px;
      border: none;
      transition: background-color .3s;
      cursor: pointer;
      &:nth-child(1) {
        &:hover {
          background-color: #67cf67;
        }
      }
      &:nth-child(2) {
        &:hover {
          background-color: #dd4b39;
        }
      }
    }
  }
</style>