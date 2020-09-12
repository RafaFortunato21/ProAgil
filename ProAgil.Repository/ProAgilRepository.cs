using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
            //_context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking; 
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity); 
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrante = false)
        {
            IQueryable<Evento> query =  _context.Eventos
                .Include(x => x.Lotes)
                .Include(c => c.RedesSociais);

                if (includePalestrante)
                    query = query.Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            
            query = query.AsNoTracking().OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();
        }


        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrante)
        {
             IQueryable<Evento> query =  _context.Eventos
                .Include(x => x.Lotes)
                .Include(c => c.RedesSociais);

                if (includePalestrante)
                    query = query.Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            
            query = query.AsNoTracking().OrderByDescending(c => c.DataEvento)
                        .Where(x => x.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }
        public async Task<Evento> GetAllEventoAsyncById(int EventoId, bool includePalestrante)
        {
           IQueryable<Evento> query =  _context.Eventos
                .Include(x => x.Lotes)
                .Include(c => c.RedesSociais);

                if (includePalestrante)
                    query = query.Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            
            query = query.AsNoTracking().OrderByDescending(c => c.DataEvento)
                        .Where(x => x.Id == EventoId);

            return await query.FirstOrDefaultAsync();
        }


        //PALESTRANTE
        public async Task<Palestrante[]> GetAllPalestranteAsync(bool includeEvento = false){
            
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(x => x.RedesSociais);

            if (includeEvento)
                query = query.Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Evento);

            query = query.AsNoTracking().OrderBy(x => x.Nome);

            return await query.ToArrayAsync();

        }
        public async Task<Palestrante> GetPalestrantesAsyncById(int PalestranteId, bool includeEventos)
        {
            IQueryable<Palestrante> query =  _context.Palestrantes
                .Include(c => c.RedesSociais);

                if (includeEventos)
                    query = query.Include(pe => pe.PalestranteEventos) 
                    .ThenInclude(p => p.Evento);
            
            query = query.AsNoTracking().OrderBy(c => c.Nome).Where(x => x.Id == PalestranteId);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEvento)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(x => x.RedesSociais);

                if (includeEvento)
                {
                    query = query.Include(p => p.PalestranteEventos)
                        .ThenInclude(p => p.Evento);
                }
                
                query = query.AsNoTracking().Where(x => x.Nome.ToLower().Contains(name.ToLower())).OrderBy(p => p.Nome);
                
                return await query.ToArrayAsync();
        }

        
    }
}