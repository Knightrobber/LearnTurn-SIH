import { Mongo } from "meteor/mongo";

const Transactions = new Mongo.Collection("Transactions");

export default Transactions;