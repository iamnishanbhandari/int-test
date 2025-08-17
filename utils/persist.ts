export const persistMessage = (message: any, messageNo: number) => {
  console.log(messageNo);
  localStorage.setItem(
    `message${messageNo === 0 ? 5 : messageNo}`,
    JSON.stringify(message)
  );
};
