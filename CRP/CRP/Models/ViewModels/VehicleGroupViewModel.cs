using AutoMapper;
using CRP.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models.ViewModels
{
    public class VehicleGroupViewModel : VehicleGroup
    {
        public VehicleGroupViewModel() : base() { }

        public VehicleGroupViewModel(VehicleGroup vg, IMapper mapper) : this()
        {
            mapper.Map(vg, this);
        }
    }
}