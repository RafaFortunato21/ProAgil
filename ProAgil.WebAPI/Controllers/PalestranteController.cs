using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProAgil.Domain;
using ProAgil.Repository;


namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repo;

        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }


        [HttpGet]
        public async Task<IActionResult> Get(){
            
            try
            {
                var results = await _repo.GetAllPalestranteAsync(true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

        }

        [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId){
            
            try
            {
                var results = await _repo.GetPalestrantesAsyncById(PalestranteId, true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

        }
    
        [HttpGet("getByName/{Name}")]
        public async Task<IActionResult> Get(string Name){
            
            try
            {
                var results = await _repo.GetAllPalestrantesAsyncByName(Name, true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

        }
    
        [HttpPost]
        public async Task<ActionResult> Post(Palestrante model){

            try
            {
                _repo.Add(model);
                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/palestrante/{model.Id}",model);
                }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
            return BadRequest();


        }
        
        [HttpPut]
        public async Task<ActionResult> Put(int PalestranteId, Palestrante model){

            try
            {
                var palestrante = _repo.GetPalestrantesAsyncById(PalestranteId, true);

                if (palestrante == null) return NotFound();

                _repo.Update(model);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/palestrante/{model.Id}",model);
                }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
            return BadRequest();


        }

        [HttpDelete]
        public async Task<ActionResult> Delete(int PalestranteId){

            try
            {
                var palestrante = _repo.GetPalestrantesAsyncById(PalestranteId, true);

                if (palestrante == null) return NotFound();

                _repo.Delete(palestrante);

                if (await _repo.SaveChangesAsync())
                    return Ok();

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
            return BadRequest();


        }
    
        
    }
}