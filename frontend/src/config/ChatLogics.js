export const getSender = (userId, users) => {
  return userId === users[0]._id ? users[1] : users[0];
};
