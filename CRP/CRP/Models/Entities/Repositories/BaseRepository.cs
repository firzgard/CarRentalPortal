using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public interface IRepository
	{

	}

	public interface IRepository<TEntity> : IRepository
		where TEntity : class
	{
		TEntity Get(object key);
		IEnumerable<TEntity> GetAll();
		IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);

		Task<TEntity> GetAsync(object key);

		void Create(TEntity entity);

		void Update(TEntity entity);
	}

	public abstract class BaseRepository<TEntity> : IRepository<TEntity>
		where TEntity : class
	{
		private CRPEntities entites { get; set; }
		private DbSet<TEntity> dbSet { get; set; }

		public BaseRepository(CRPEntities dbContext)
		{
			this.entites = dbContext;
			this.dbSet = dbContext.Set<TEntity>();
		}

		public void Create(TEntity entity)
		{
			dbSet.Add(entity);
		}

		public TEntity Get(object key)
		{
			return this.dbSet.Find(key);
		}

		public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
		{
			return this.dbSet.Where(predicate);
		}

		public void Update(TEntity entity)
		{
			this.entites.Entry(entity).State = EntityState.Modified;
		}

		public async Task<TEntity> GetAsync(object key)
		{
			return await this.dbSet.FindAsync(key);
		}

        public IEnumerable<TEntity> GetAll()
        {
            return this.dbSet.ToList<TEntity>();
        }
    }
}
