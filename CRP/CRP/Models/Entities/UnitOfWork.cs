using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace CRP.Models.Entities
{
	public interface IUnitOfWork : IDisposable
	{
		void Save();
		Task SaveAsync();
	}

	public class UnitOfWork : IUnitOfWork
	{
		private CRPEntities entities { get; set; }

		public UnitOfWork(CRPEntities entities)
		{
			this.entities = entities;
		}

		public void Save()
		{
			entities.SaveChanges();
		}

		public async Task SaveAsync()
		{
			await this.entities.SaveChangesAsync();
		}

		public void Dispose()
		{
			entities.Dispose();
		}
	}
}