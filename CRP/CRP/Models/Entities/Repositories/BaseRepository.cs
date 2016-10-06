using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public class IEntity
	{
		public string Id;
	}

    public interface IBaseRepository
    {

    }

	public interface IBaseRepository<T> where T : class
	{
		IEnumerable<T> List { get; }
		void Add(T entity);
		void Delete(T entity);
		void Update(T entity);
		T findById(int Id);
	}
}
