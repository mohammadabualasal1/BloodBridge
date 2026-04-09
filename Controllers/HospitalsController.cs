using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge.Model;
using BloodBridge.DTOs;
using BloodBridge.DTOs.AuthDtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public HospitalsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("complete-profile")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> CompleteProfile([FromBody] HospitalDto dto)
        {

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var existing = _dbContext.Hospitals.Any(a => a.UserId == userId);
            if (existing) { return BadRequest(); }

            var hospital = new Hospitals
            {
                UserId = userId,
                HospitalName = dto.HospitalName,
                City = dto.City,
                Address = dto.Address,
                IsVerified = false
            };
            _dbContext.Hospitals.Add(hospital);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Profile completed successfully" });
        }



        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllHospitals")]
        public IActionResult GetAllHospitals()
        {

            var hospitals = _dbContext.Hospitals.Include(h => h.User).
                Select(h => new

                {
                    h.Id,
                    h.HospitalName,
                    h.City,
                    h.Address,
                    h.IsVerified,
                    UserEmail = h.User.Email
                }).ToList();
            return Ok(hospitals);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("VerifyHospital/{id}")]
        public async Task<IActionResult> VerifyHospital(long id)
        {
            var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.Id == id);
            if (hospital == null) { return NotFound(); }
            hospital.IsVerified = true;
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Hospital verified successfully" });



        }
    }
}
