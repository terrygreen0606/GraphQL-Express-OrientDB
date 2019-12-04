var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
});

var db = server.use({
  name: 'orient',
  username: 'root',
  password: '111'
});

// createDatabases()
// insertRecords()
// createEdge()
module.exports = db;

function createDatabases() {
  db.class.create('Patients', 'V')
    .then(function (Patients) {

      Patients.property.create([{
        name: 'parentId',
        type: 'Integer',
        mandatory: true
      }, {
        name: 'username',
        type: 'String',
        mandatory: true,
        non_null: true
      }, {
        name: 'password',
        type: 'String',
        mandatory: true,
        non_null: true
      }])
    });

  db.class.create('PatientDetails', 'V')
    .then((PatientDetails) => {

      PatientDetails.property.create([{
        name: 'patientId',
        type: 'String',
        mandatory: true
      }, {
        name: 'address',
        type: 'String',
        mandatory: true,
        non_null: true
      }, {
        name: 'mobileNumber',
        type: 'String'
      }])
    })
}

async function insertRecords() {

  // Insert Patients
  const resPatients = await db.class.get('Patients')
  const insertPatients = await resPatients.create([{
      parentId: 2,
      username: 'aaa',
      password: '111'
    },
    {
      parentId: 22,
      username: 'bbb',
      password: '111'
    },
    {
      parentId: 222,
      username: 'ccc',
      password: '111'
    }
  ])

  // Insert PatientDetails
  const resPatientDetails = await db.class.get('PatientDetails')
  const insertPatientDetails = await resPatientDetails.create([{
      patientId: 3,
      address: 'eee',
      mobileNumber: '1515151'
    },
    {
      patientId: 33,
      address: 'fff',
      mobileNumber: '1515151'
    },
    {
      patientId: 333,
      address: 'ggg',
      mobileNumber: '1515151'
    }
  ])
}

async function createEdge() {

  // Get records of patients and their details from DB
  const resPatients = await db.class.get('Patients')
  const resPatientDetails = await db.class.get('PatientDetails')
  const patientRecords = await resPatients.list()
  const patientDetails = await resPatientDetails.list()

  /* *****Start Create Edges between Patients and PatientDetails *********** */
  const patientsEdge = await db.class.create('PatientsRelationship', 'E')

  const realEdge = await db.create('EDGE', 'PatientsRelationship')
    .from(patientRecords[0]['@rid'])
    .to(patientDetails[0]['@rid'])
    .one()

  //Read Edges
  // const patientsRelationship = await db.class.get('PatientsRelationship');
  // const realEdge = await patientsRelationship.list();
  // console.log(realEdge);

  /* *****End Create Edges between Patients and PatientDetails *********** */
}

function test() {
  db.query('SELECT FROM PATIENTDETAILS WHERE patientId=:id', {
    params: {
      id: '#21:0'
    }
  }).then((result) => {
    result.forEach(element => {
      value = element['@rid'];
      delete element['@rid'];
      element.id = value;
    });
    console.log(result)
  })
}

// test()

// db.close()
// server.close()