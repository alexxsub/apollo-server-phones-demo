const { ApolloServer, gql } = require("apollo-server");
//some demo data array
var _phones = [
  { number: "5555", name: "John" },
  { number: "6666", name: "Bill" },
  { number: "7777", name: "Smith" },
  { number: "1234", name: "Sara" }
];
//types for graphql
const typeDefs = gql`
  type Query {
    """
    Get all phones
    """
    Phones: [Phone]
    """
    Find name of person in phone list
    """
    findName(number: String): Phone
  }
  type Phone {
    """
    Number of phone
    """
    number: String
    """
    Name of person
    """
    name: String
  }
  input inputPhone {
    number: String!
    name: String
  }
  type Mutation {
    addPhone(input: inputPhone): [Phone] #example with input type
    deletePhone(number: String): [Phone]
    updatePhone(number: String, name: String): [Phone] #example with separated params
  }
`;
//resolvers for graphql
const resolvers = {
  Phone: {
    name: root => {
      console.log(root);
      if (root.number === "5555") {
        //find number 5555 and hide name of person
        return "*censored*";
      } else {
        return root.name;
      }
    }
  },
  Query: {
    Phones: () => {
      return _phones; //just return all array
    },
    findName: (_, { number }) => {
      return _phones.filter(p => p.number === number)[0];
    }
  },
  Mutation: {
    addPhone: (_, { input }) => {
      _phones.push(input);
      return _phones;
    },
    deletePhone: (_, { number }) => {
      _phones.splice(_phones.findIndex(x => x.number === number), 1);
      return _phones;
    },
    updatePhone: (_, { number, name }) => {
      const numberi = _phones.findIndex(x => x.number === number);
      const namei = _phones.findIndex(x => x.name === name);
      const index = numberi > 0 ? numberi : namei;
      _phones.splice(index, 1, { number: number, name: name });
      return _phones;
    }
  }
};
//create new Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
});
//start it
const HOST = process.argv[2];
const PORT = process.argv[3];

server.listen({ host: HOST, port: PORT }).then(({ url }) => {
  console.log(`🚀   Взлетел ${url}`);
});
