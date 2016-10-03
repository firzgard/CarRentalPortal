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
	}

	public abstract class BaseService<TEntity> : IService<TEntity>
		where TEntity : class
	{
	}
}