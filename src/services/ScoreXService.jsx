
class ScoreXService {

  constructor(){
  }

  get(url) {

    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return fetch(url, options);
  }

  post(url, body){
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }

    return fetch(url, options);
  }

  async postUser(body){
    const url = `http://localhost:3000/users`;

    return await this.post(url, body)
      .then( response => response.json())
      .then( data => data)
      .catch( err => console.log('Error en el fetch: ', err));

  }

  async getUsers(){

    const url = `http://localhost:3000/users`;
    
    return await this.get(url)
      .then( response => response.json() )
      .then( data => data)
      .catch( err => console.log('Error en el fetch: ', err ) );

  }

  async getUser(id){

    const url = `http://localhost:3000/users/${id}`;

    return await this.get(url)
      .then( response => response.json() )
      .then( data => data)
      .catch( err => console.log('Error en el fetch: ', err ) );

  }

  async getReview(id){

    const url = `http://localhost:3000/reviews/${id}`;

    return await this.get(url)
      .then( response => response.json() )
      .then( data => data)
      .catch( err => console.log('Error en el fetch: ', err ) );

  }

  // async customSearch(search){
  //   const apiKey = import.meta.env.VITE_RAWG_APIKEY;
  //   const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${search}`;
    
  //   return await this.get(url)
  //     .then( response => response.json() )
  //     .then( data => data)
  //     .catch( err => console.log('Error en el fetch: ', err ) );
  // }

}


export default ScoreXService;