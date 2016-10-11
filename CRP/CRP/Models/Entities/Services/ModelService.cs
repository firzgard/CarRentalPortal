using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public interface IModelService : IService<Model>
    {

    }
    public class ModelService : BaseService<Model>, IModelService
    {
        public ModelService(IUnitOfWork unitOfWork, IModelRepository repository) : base(unitOfWork, repository)
        {

        }
    }
}