using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;
using CRP.Models.Entities.Repositories;

namespace CRP.Models.Entities.Services
{
	public interface IService
	{

	}

	public interface IService<TEntity> : IService
		where TEntity : class
	{
		TEntity Get(object key);
		IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
		void Create(TEntity entity);
		void Update(TEntity entity);
		void Save();

		void DeActivate(TEntity entity);

		Task DeActivateAsync(TEntity entity);

		void OnCreate(TEntity entity);

		#region Async Function
		Task<TEntity> GetAsync(object key);
		Task CreateAsync(TEntity entity);
		Task UpdateAsync(TEntity entity);
		Task SaveAsync();
		#endregion
	}

	public abstract class BaseService<TEntity> : IService<TEntity>
		where TEntity : class
	{
		public IRepository<TEntity> repository { get; set; }
		public IUnitOfWork unitOfWork { get; set; }

		public BaseService(IUnitOfWork unitOfWork, IRepository<TEntity> repository)
		{
			this.repository = repository;
			this.unitOfWork = unitOfWork;
		}

		public virtual void Create(TEntity entity)
		{
			this.OnCreate(entity);

			this.repository.Create(entity);
			this.Save();
		}

		public virtual async Task CreateAsync(TEntity entity)
		{
			this.OnCreate(entity);

			this.repository.Create(entity);
			await this.SaveAsync();
		}
		
		public virtual TEntity Get(object key)
		{
			return this.repository.Get(key);
		}

		public virtual IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
		{
			return this.repository.Find(predicate);
		}

		public virtual async Task<TEntity> GetAsync(object key)
		{
			return await this.repository.GetAsync(key);
		}

		public virtual void Save()
		{
			this.unitOfWork.Save();
		}

		public virtual async Task SaveAsync()
		{
			await this.unitOfWork.SaveAsync();
		}

		public virtual void Update(TEntity entity)
		{
			this.repository.Update(entity);
			this.Save();
		}

		public virtual async Task UpdateAsync(TEntity entity)
		{
			this.repository.Update(entity);
			await this.SaveAsync();
		}

		public virtual void OnCreate(TEntity entity)
		{
			this.SetActive(entity, true);
		}

		public void DeActivate(TEntity entity)
		{
			this.SetActive(entity, false);
			this.Save();
		}

		public async Task DeActivateAsync(TEntity entity)
		{
			this.SetActive(entity, false);
			await this.SaveAsync();
		}

		private void SetActive(TEntity entity, bool value)
		{
			var typeInfo = typeof(TEntity);

			var activeProperty = typeInfo.GetProperty("Active",
				System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);

			if (activeProperty != null)
			{
				activeProperty.SetValue(entity, value);
			}
		}
	}
}