(function(){
  'use strict';
    var app = angular.module('services.customers',[]);
    app.factory('Service_Customers', function($cordovaSQLite,collectiondb){
      'use strict';
      var contacts = [
        {
          "id":1,
          "id_web":1,
          "nombre":"Aleida Loyo ",
          "dni":"V-7374835",
          "cliente":{
            "id":1,
            "nombre":"Leonardo Loyo",
            "id_web":100,
            "cuit":"v-21295782",
            "tipo_de_cliente_id":1
          },
          "tipo_de_relacion":{"id":3,"tipo_de_relacion":"Madre"}
        },
        {
          "id":2,
          "id_web":2,
          "nombre":"Hercilia Rodriguez",
          "dni":"V-1777114",
          "tipo_de_relacion":{"id":2,"tipo_de_relacion":"Esposa"},
          "cliente":{
            "id":2,
            "nombre":"Desiderio Loyo",
            "id_web":200,
            "cuit":"V-01772713",
            "tipo_de_cliente_id":1
        }
      }];
      var customer = {};
      var customers = [{
                      "id":1,
                      "nombre":"Leonardo Loyo",
                      "id_web":100,
                      "cuit":"v-21295782",
                      "tipo_de_cliente_id":1
                     },{
                      "id":2,
                      "nombre":"Desiderio Loyo",
                      "id_web":200,
                      "cuit":"V-01772713",
                      "tipo_de_cliente_id":1
                     }
                   ];

      function buscar(Id){
      for (var i = 0; i < customers.length; i++) {
      if (customers[i].id === parseInt(Id)) {
        return customers[i];
      }
      }
      return null;}
      function buscarindex(Id){
        for (var i = 0; i < customers.length; i++) {
                if (customers[i].id === parseInt(Id)) {
                  return i;
                }
          }
        return null;}
        var get = function(array,table){
          if(db != null){
            var query = "SELECT * FROM " + table;
            array = [];
            array = collectiondb.all(query);
          }
          return array;}

      return {
        customer_sync:function(data){
          if(db!=null){
            var params = [];
            angular.forEach(data, function(object, key){
              var query = "SELECT * FROM cliente_cliente WHERE id_web = ?";
              $cordovaSQLite.execute(db,query,[object.id]).then(
                function(result){
                  if(result.rows.length <= 0){
                    params = [
                                   object.id,
                                   object.nombre,
                                   object.observaciones,
                                   object.cuit,
                                   object.tipo_de_cliente.id
                                   ];
                    collectiondb.create('INSERT INTO cliente_cliente (id_web,nombre,observaciones,cuit,tipo_de_cliente_id) VALUES(?,?,?,?,?)',params);
                  }else{
                    params = [object.nombre,
                                   object.observaciones,
                                   object.cuit,
                                   object.tipo_de_cliente.id
                                   ];
                    collectiondb.update('UPDATE cliente_cliente set nombre=?, observaciones=?, cuit=?, tipo_de_cliente_id=? where id_web =',params,object['id']);
                  }//else
                },function(error){
                  alert('hubo un error find '+ error.menssages)
                  return false;
                });//foreach db
            });
            customers=[];
          }else{
            angular.forEach(data, function(object, key){
              if(collectiondb.findOne(get(customers,'cliente_cliente'),object.id,"id_web")==undefined){
                customers.push(object);
              }else{
                customers[collectiondb.findOne(customers,object.id,"id_web")]=object;
              }
            });//foreach web
          }
          return true;
        },
        new:function(data){
              if(!db){
                console.log(data);
                customer.nombre = data.nombre;
                customer.cuit = data.cuit;
                customer.observaciones = data.observaciones;
                customer.tipo_de_cliente_id = data.tipo_de_cliente_id;
                customers.push(customer);
                customer = {};
              }else{
                params = [data.nombre,data.cuit,data.observaciones,data.tipo_de_cliente_id];
                return collectiondb.create('INSERT INTO cliente_cliente (nombre,cuit,observaciones,tipo_de_cliente_id) VALUES(?,?,?,?)',params);
              }

              return customer;
            },
          get:function(){
            if(db!=null){
              var query = 'SELECT * FROM cliente_cliente'
              customers = [];
              customers = collectiondb.all(query);
             }
             return customers;
          },
          findOne: function(Id){
            return customers[collectiondb.findOne(customers,Id,"id_web")];

          },
          update:function(model){
            console.log('grabare');
            customers[buscarindex(model.id)] = model;
          },
          count:function(){
            return customers.length;
          },
          load_db:function(){
                  if(db!=null){
                    var cliente1 = ['obs1','Leonardo','1234',1];
                    var cliente2 = ['obs12','antonio','4321','asda'];
                    var data = [cliente1,cliente2];

                    var query = "INSERT INTO cliente_cliente (observaciones,nombre,cuit,tipo_de_cliente_id) VALUES (?,?,?,?)";
                    db.transaction(function(tx){
                      for(var i=0; i<data.length;i++){
                        // alert(i);
                        $cordovaSQLite.execute(db,query,data[i]).then(function success(result){
                          // alert(result);
                        },function error(e){
                          alert(e);
                          return false;
                        });
                      }
                    return true;
                    },function(e){
                      alert('errorrrrr');
                      return false;
                    });

                  }
                },
                contacts_get:function(param){
                  // console.log(param);
                  var cs = [];
                  for (var i = 0; i < contacts.length; i++) {
                    if(contacts[i].cliente.id_web == param){
                      cs.push(contacts[i]);                      
                    }
                  }
                  return cs;
                }//end contacs_get
             }
     });
})()
