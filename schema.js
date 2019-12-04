const db = require('./db')
const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql; //Grab with graphql package

const Patient = new GraphQLObjectType({
  name: 'Patient',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLInt
    },
    patientDetails: {
      type: new GraphQLList(PatientDetails),
      resolve(parent, args) {
        let value = '#' + parent.id.cluster + ':' + parent.id.position;
        return db.query('SELECT FROM PATIENTDETAILS WHERE patientId=:id', {
          params: {
            id: value
          }
        }).then((result) => {
          result.forEach(element => {
            let value = element['@rid'];
            delete element['@rid'];
            element.id = value;
          });

          return result
        })
      }
    }
  })
});

const PatientDetails = new GraphQLObjectType({
  name: 'PatientDetails',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    patientId: {
      type: GraphQLString
    },
    mobileNumber: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    patient: {
      type: Patient,
      resolve(parent, args) {
        return db.record.get(parent.patientId).then((result) => {
          let value = result['@rid'];
          delete result['@rid'];
          result.id = value;
          return result
        })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    patient: {
      type: Patient,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        // data from db
        return db.record.get(args.id).then((result) => {
          let value = result['@rid'];
          delete result['@rid'];
          result.id = value;
          return result
        })
      }
    },

    patientDetail: {
      type: PatientDetails,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        // data from db
        return db.record.get(args.id).then((result) => {
          let value = result['@rid'];
          delete result['@rid'];
          result.id = value;
          return result
        })
      }
    },

    patients: {
      type: new GraphQLList(Patient),
      resolve(parent, args) {
        return db.class.get('Patients').then((table) => {
          return table.list().then((result) => {
            result.forEach(element => {
              let value = element['@rid'];
              delete element['@rid'];
              element.id = value;
            });
            return result
          })
        })
      }
    },

    patientDetails: {
      type: new GraphQLList(PatientDetails),
      resolve(parent, args) {
        return db.class.get('PatientDetails').then((table) => {
          return table.list().then((result) => {
            result.forEach(element => {
              let value = element['@rid'];
              delete element['@rid'];
              element.id = value;
            });
            return result
          })
        })
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPatient: {
      type: Patient,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        },
        parentId: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parent, args) {
        return db.class.get('Patients').then((Patients) => {
          return Patients.create({
            username: args.username,
            password: args.password,
            parentId: args.parentId
          }).then((result) => {
            let value = result['@rid'];
            delete result['@rid'];
            result.id = value;
            return result
          })
        })
      }

    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})