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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CompleteProfile([FromBody] HospitalDto dto)
        {
            try
            {
                var existing = _dbContext.Hospitals.Any(a => a.UserId == dto.UserId);
                if (existing) { return BadRequest(); }
                var hospital = new Hospitals
                {
                    UserId = dto.UserId, 
                    HospitalName = dto.HospitalName,
                    City = dto.City,
                    Address = dto.Address,
                    IsVerified = false
                };
                _dbContext.Hospitals.Add(hospital);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Profile completed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllHospitals")]
        public IActionResult GetAllHospitals()
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("VerifyHospital/{id}")]
        public async Task<IActionResult> VerifyHospital(long id)
        {
            try
            {
                var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.Id == id);
                if (hospital == null) { return NotFound(); }
                hospital.IsVerified = true;
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Hospital verified successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
        }
}
