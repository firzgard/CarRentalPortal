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
	}

	public abstract class BaseRepository<TEntity> : IRepository<TEntity>
		where TEntity : class
	{
	}
}
